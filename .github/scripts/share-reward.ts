import { components } from 'npm:@octokit/openapi-types';
import { $, argv, YAML } from 'npm:zx';

import { Reward } from './type.ts';

$.verbose = true;

const [
  repositoryOwner,
  repositoryName,
  issueNumber,
  payer, // GitHub username of the payer (provided by workflow, defaults to issue creator)
  currency,
  reward,
] = argv._;

interface PRMeta {
  author: components['schemas']['simple-user'];
  assignees: components['schemas']['simple-user'][];
}

const PR_URL = await $`gh api graphql -f query='{
  repository(owner: "${repositoryOwner}", name: "${repositoryName}") {
    issue(number: ${issueNumber}) {
      closedByPullRequestsReferences(first: 10) {
        nodes {
          url
          merged
        }
      }
    }
  }
}' --jq '.data.repository.issue.closedByPullRequestsReferences.nodes[] | select(.merged == true) | .url' | head -n 1`;

if (!PR_URL.text().trim())
  throw new ReferenceError('No merged PR is found for the given issue number.');

const { author, assignees }: PRMeta = await (
  await $`gh pr view ${PR_URL} --json author,assignees`
).json();

// Function to check if a user is a Copilot/bot user
function isCopilotUser(login: string): boolean {
  const lowerLogin = login.toLowerCase();
  return (
    lowerLogin.includes('copilot') ||
    lowerLogin.includes('[bot]') ||
    lowerLogin === 'github-actions[bot]' ||
    lowerLogin.endsWith('[bot]')
  );
}

// Filter out Copilot and bot users from the list
const allUsers = [author.login, ...assignees.map(({ login }) => login)];
const users = allUsers.filter(login => !isCopilotUser(login));

console.log(`All users: ${allUsers.join(', ')}`);
console.log(`Filtered users (excluding bots/copilot): ${users.join(', ')}`);

// Handle case where all users are bots/copilot
if (users.length === 0) {
  console.log('No real users found (all users are bots/copilot). Skipping reward distribution.');
  console.log(`Filtered users: ${allUsers.join(', ')}`);
  process.exit(0);
}

const rewardNumber = parseFloat(reward);

if (isNaN(rewardNumber) || rewardNumber <= 0)
  throw new RangeError(
    `Reward amount is not a valid number, can not proceed with reward distribution. Received reward value: ${reward}`,
  );

const averageReward = (rewardNumber / users.length).toFixed(2);

const list: Reward[] = users.map(login => ({
  issue: `#${issueNumber}`,
  payer: `@${payer}`,
  payee: `@${login}`,
  currency,
  reward: parseFloat(averageReward),
}));
const listText = YAML.stringify(list);

console.log(listText);

await $`git config --global user.name "github-actions[bot]"`;
await $`git config --global user.email "github-actions[bot]@users.noreply.github.com"`;
await $`git tag -a "reward-${issueNumber}" -m ${listText}`;
await $`git push origin --tags`;

const commentBody = `## Reward data

\`\`\`yml
${listText}
\`\`\`
`;
await $`gh issue comment ${issueNumber} --body ${commentBody}`;
