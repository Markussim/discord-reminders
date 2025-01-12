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

### Message sender
resource "aws_iam_role" "message_sender_role" {
  name               = "message_sender_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy_attachment" "secrets_manager_policy_attachment" {
  name       = "secrets_manager_policy_attachment"
  roles      = ["${aws_iam_role.message_sender_role.name}"]
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

data "archive_file" "message_sender_lambda_files" {
  type        = "zip"
  source_dir  = "../apps/messageSender/dist/"
  output_path = "message_sender_payload.zip"
}

resource "aws_lambda_function" "message_sender_lambda" {
  filename      = "message_sender_payload.zip"
  function_name = "message_sender"
  role          = aws_iam_role.message_sender_role.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.message_sender_lambda_files.output_base64sha256

  runtime = "nodejs22.x"
}


### Eventbridge stuff

resource "aws_scheduler_schedule_group" "eventbridge_schedule_group" {
  name = "reminderGroup"
}




### Schedule creator
resource "aws_iam_role" "schedule_creator_role" {
  name               = "schedule_creator_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "message_sender_invoker_role" {
  name = "message_sender_invoker_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "scheduler.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "schedule_creator_policy" {
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "scheduler:*",
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = "iam:PassRole",
        Resource = ["${aws_iam_role.message_sender_invoker_role.arn}"],
        Condition = {
          StringLike = {
            "iam:PassedToService" : "scheduler.amazonaws.com"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "schedule_creator_policy_attachment" {
  name       = "aaaaaa"
  policy_arn = aws_iam_policy.schedule_creator_policy.arn
  roles      = [aws_iam_role.schedule_creator_role.name]
}

resource "aws_iam_policy" "message_sender_invoker_policy" {
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["lambda:InvokeFunction"],
        Resource = ["${aws_lambda_function.message_sender_lambda.arn}:*", "${aws_lambda_function.message_sender_lambda.arn}"]
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "message_sender_invoker_policy_attachment" {
  name       = "aaaaa"
  policy_arn = aws_iam_policy.message_sender_invoker_policy.arn
  roles      = [aws_iam_role.message_sender_invoker_role.name]
}

data "archive_file" "schedule_creator_lambda_files" {
  type        = "zip"
  source_dir  = "../apps/scheduleCreator/dist/"
  output_path = "schedule_creator_payload.zip"
}

resource "aws_lambda_function" "schedule_creator_lambda" {
  filename      = "schedule_creator_payload.zip"
  function_name = "schedule_creator"
  role          = aws_iam_role.schedule_creator_role.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.schedule_creator_lambda_files.output_base64sha256

  runtime = "nodejs22.x"

  environment {
    variables = {
      target_lambda_arn = "${aws_lambda_function.message_sender_lambda.arn}"
      invoker_role_arn  = "${aws_iam_role.message_sender_invoker_role.arn}"
    }
  }
}
