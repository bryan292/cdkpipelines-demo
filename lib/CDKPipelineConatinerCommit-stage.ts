import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { CdkPipeline, CodePipeline, CodePipelineSource, ShellStep, SimpleSynthAction } from "@aws-cdk/pipelines";
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import { CDKPipelineConatinerCommitStack } from './CDKPipelineConatinerCommit-stack';


/**
 * Deployable unit of web service app
 */
export class CDKPipelineConatinerCommit extends Stage {
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new CDKPipelineConatinerCommitStack(this, 'dockerHubStack');
    
    // Expose CdkpipelinesDemoStack's output one level higher
  }
}
