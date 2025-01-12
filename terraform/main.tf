provider "aws" {
  region  = var.region
  profile = "velody-dr"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.83"
    }
  }
}


data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}


resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy_attachment" "secrets_manager_policy_attachment" {
  name       = "secrets_manager_policy_attachment"
  roles      = ["${aws_iam_role.iam_for_lambda.name}"]
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

data "archive_file" "message_sender_lambda_files" {
  type        = "zip"
  source_dir  = "../apps/messageSender/dist/"
  output_path = "lambda_function_payload.zip"
}

resource "aws_lambda_function" "message_sender_lambda" {
  filename      = "lambda_function_payload.zip"
  function_name = "message_sender"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.message_sender_lambda_files.output_base64sha256

  runtime = "nodejs22.x"
}
