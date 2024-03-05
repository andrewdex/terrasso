# TerraSSO

Streamline AWS SSO Setup for Terraform Integration: Effortlessly Configure AWS SSO to Pair with Terraform

### Prerequisites

- AWS CLI
- Terraform
- AWS SSO configured in your AWS account

## How to Use

1. Clone the repository

```bash
git clone https://github.com/andrewdex/terrasso.git
```

2. Change into the directory

```bash
cd terrasso
```

3. Install the dependencies

```bash
npm install
```

4. Run the setup script

```bash
npm run start
```

After completing the setup, you will see a message displaying the logged-in AWS Profile and the AWS SSO URL.

```bash

    Successfully logged into Start URL: https://<AWS SSO URL>/start
{
    "UserId": "USERID",
    "Account": "ACCOUNT NUMBER",
    "Arn": "arn:aws:sts::ACCNO:assumed-role/AWSReservedSSO_AdministratorAccess_XXXX/user_id"
}
```

5. Follow the prompts to configure AWS SSO

You can grab the AWS SSO URL from AWS Console along with all the other information you need to configure AWS SSO prompted.
It will need below information to configure AWS SSO:

- AWS SSO Profile name (this should be one word and don't use any special characters or spaces)
- AWS SSO Account ID (12 digit number)
- AWS SSO Region (e.g. us-east-1)
- AWS SSO Role Name (E.g AdministratorAccess)

To verify that the setup was successful, run the terraform init command in the terraform resources directory you want to use the AWS SSO configuration with.

make sure you have specified the AWS SSO profile name in the provider block in the main.tf file.

E.g:

```bash
provider "aws" {
  profile = "aws-sso-profile-name"
  region  = "us-east-1"
}

terraform {
    backend "s3" {
        bucket = "my-terraform-state-bucket"
        key    = "my-terraform-state-key"
        region = "us-east-1"
        profile = "aws-sso-profile-name"
    }
}
```

If you have done that then you can run the below command to verify the setup:

```bash
terraform init
```

If everything is configured correctly, your terraform resources will be initialized successfully.
