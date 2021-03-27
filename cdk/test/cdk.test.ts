import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Stack from '../lib/ecsTaskStack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Stack.DistributedECSTaskStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
