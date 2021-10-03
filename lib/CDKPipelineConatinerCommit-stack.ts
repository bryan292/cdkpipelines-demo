import { Construct, SecretValue, Stack, StackProps, } from '@aws-cdk/core';
import { CdkPipeline, CodePipeline, CodePipelineSource, PipelineBase, ShellStep, SimpleSynthAction } from "@aws-cdk/pipelines";
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';
import { CDKPipelineConatinerCommit } from './CDKPipelineConatinerCommit-stage';
import * as iam from '@aws-cdk/aws-iam'


/**
 * The stack that defines the application pipeline
 */
export class CDKPipelineConatinerCommitStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const gitHubSource = codebuild.Source.gitHub({
        owner: 'bryan292',
        repo: 'react-calculator',
        webhook: true, // optional, default: true if `webhookFilters` were provided, false otherwise
        
        webhookTriggersBatchBuild: false, // optional, default is false
       // webhookFilters: [
       //   codebuild.FilterGroup
        //    .inEventOf(codebuild.EventAction.PUSH)
       //     .andBranchIs('master')
       // ], // optional, by default all pushes and Pull Requests will trigger a build
       
      });

      const codeCommitRole= new iam.Role(this,'codecommit-role',{
        assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
        roleName: 'codecommit-role',
        managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('SecretsManagerReadWrite')]
  
      }); 
  
      const code = new codebuild.Project(this,'CodeCommit',{
        environment:{
            privileged: true,
          buildImage: codebuild.LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-x86_64-standard:3.0'),
          
        },
        source: gitHubSource,  
        role: codeCommitRole
      })

    }
  }