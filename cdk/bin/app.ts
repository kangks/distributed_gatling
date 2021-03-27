import cdk = require('@aws-cdk/core');
import { SimpleFargateWebService } from '../lib/simpleServerStack';
import { DistributedECSTaskStack } from '../lib/ecsTaskStack';

const app = new cdk.App();
new DistributedECSTaskStack(app, 'ecsLoadTestTask' );
new SimpleFargateWebService(app, 'simpleWebFargate');
app.synth();