import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from "@aws-cdk/pipelines";

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',

       // How it will be built and synthesized
       synth: new ShellStep('Synth', {
         // Where the source can be found
         input: CodePipelineSource.gitHub('OWNER/REPO', 'main'),
         
         // Install dependencies, build and run cdk synth
         commands: [
           'npm ci',
           'npm run build',
           'npx cdk synth'
         ],
       }),
    });

    // This is where we add the application stages
    // ...
  }
}
The preceding code defines the following basic properties of the pipeline:

Its name.
Where to find the source. You need to change that part to match the name of your own GitHub repo.
How to do the build and synthesis. For this use case, you use a standard NPM build (this type of build runs npm run build followed by npx cdk synth).
You also need to instantiate CdkpipelinesDemoPipelineStack with the account and Region where you want to deploy the pipeline. Put the following code in bin/cdkpipelines-demo.ts (be sure to replace ACCOUNT1 and the Region in there if necessary):

#!/usr/bin/env node
import { App } from '@aws-cdk/core';
import { CdkpipelinesDemoPipelineStack } from '../lib/cdkpipelines-demo-pipeline-stack';

const app = new App();

new CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
  env: { account: 'ACCOUNT1', region: 'us-east-2' },
});

app.synth();
