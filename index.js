import inquirer from "inquirer";
import fs from "fs";
import { exec } from "child_process";

// Prompt for AWS SSO configuration details
async function promptForConfigDetails() {
  const questions = [
    {
      type: "input",
      name: "profileName",
      message: "Enter the AWS SSO profile name:",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter a profile name.";
      },
    },
    {
      type: "input",
      name: "ssoAccountId",
      message: "Enter the AWS SSO account ID:",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter the AWS SSO account ID.";
      },
    },
    {
      type: "input",
      name: "ssoRoleName",
      message: "Enter the AWS SSO role name:",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter the AWS SSO role name.";
      },
    },
    {
      type: "input",
      name: "ssoStartUrl",
      message: "Enter the AWS SSO start URL:",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter the AWS SSO start URL.";
      },
    },
    {
      type: "input",
      name: "ssoRegion",
      message: "Enter the AWS SSO region:",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter the AWS SSO region.";
      },
    },
    {
      type: "input",
      name: "awsRegion",
      message: "Enter the default AWS region:",
      validate: function (value) {
        if (value.trim() !== "") {
          return true;
        }
        return "Please enter the default AWS region.";
      },
    },
  ];

  return inquirer.prompt(questions);
}

// Append AWS SSO configuration to the AWS CLI config file
async function appendConfigToFile(config) {
  const {
    profileName,
    ssoAccountId,
    ssoRoleName,
    ssoStartUrl,
    ssoRegion,
    awsRegion,
  } = config;
  const configContent = `
[profile ${profileName}]
sso_account_id = ${ssoAccountId}
sso_role_name = ${ssoRoleName}
sso_start_url = ${ssoStartUrl}
region = ${awsRegion}
sso_region = ${ssoRegion}
output = json
`;

  fs.appendFileSync(`${process.env.HOME}/.aws/config`, configContent);
  console.log("AWS SSO configuration has been appended to ~/.aws/config.");
}

// Execute `aws sso login` command
function runSSOLogin(profileName) {
  exec(`aws sso login --profile ${profileName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing 'aws sso login': ${error}`);
      return;
    }
    console.log(stdout);
    verifySSOLogin(profileName);
  });
}

// Verify if the user has successfully logged in to the authenticated profile
function verifySSOLogin(profileName) {
  exec(
    `aws sts get-caller-identity --profile ${profileName}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(
          `Error executing 'aws sts get-caller-identity': ${error}`
        );
        return;
      }
      console.log(stdout);
    }
  );
}

// Main function to run the CLI application
async function main() {
  try {
    console.log("Welcome to AWS SSO CLI Configuration!");
    const config = await promptForConfigDetails();
    await appendConfigToFile(config);
    runSSOLogin(config.profileName);
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

// Run the CLI application
main();
