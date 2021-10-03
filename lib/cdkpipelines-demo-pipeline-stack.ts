import { Construct, SecretValue, Stack, StackProps, } from '@aws-cdk/core';
import { CdkPipeline, CodePipeline, CodePipelineSource, ShellStep, SimpleSynthAction } from "@aws-cdk/pipelines";
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';
import { CDKPipelineConatinerCommit } from './CDKPipelineConatinerCommit-stage';

import { ShellScriptAction } from '@aws-cdk/pipelines';


/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',
      cloudAssemblyArtifact,
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'Github',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('github-token'),
        owner: 'bryan292',
        repo: 'cdkpipelines-demo',
        branch: 'master'
      }),
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'npm run build'
      }),
    });

    //pipeline.addApplicationStage(new CdkpipelinesDemoStage(this,'PrePROD',{
    //  env: { account: '389938679709', region: 'us-east-2' },

    //}));

    const dev = new CDKPipelineConatinerCommit(this,'dockerHub',{
      env: { account: '389938679709', region: 'us-east-2' },
    });

    const callMedstakDev = pipeline.addApplicationStage(dev);

    callMedstakDev.addActions(new ShellScriptAction({
      actionName: 'PushContainertoMedstak',
      additionalArtifacts: [],
    commands: [
      'curl -X POST https://dashboard.medstack.co/webhooks/incoming/9R1M8LR2/NmDki2S7mFL26aW14flF'
    ]
    }));


  }
}