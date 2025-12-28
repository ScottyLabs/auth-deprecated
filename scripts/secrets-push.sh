#!/usr/bin/env bash
source scripts/config.sh

usage() {
  echo
  echo -e "\tUsage: $0 APPLICATION ENVIRONMENT\n"
  echo -e "\t\tAPPLICATION: The application to push to, one of web | visualizer | server | rust-server | data | scripts | all\n"
  echo -e "\t\tENVIRONMENT: The environment to push to, one of local dev | staging | prod | all\n"
  echo -e "\tOptions:"
  echo -e "\t\t-h, --help    Show this help message and exit\n"
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case "$1" in
  -h | --help)
    usage
    exit 0
    ;;
  *)
    if [[ -z "$APPLICATION" ]]; then
      APPLICATION="$1"
    elif [[ -z "$ENVIRONMENT" ]]; then
      ENVIRONMENT="$1"
    else
      echo "Error: Too many arguments provided: '$1'" >&2
      usage
      exit 1
    fi
    ;;
  esac
  shift
done

# Sanitize the Application argument
if [ "$APPLICATION" == "all" ]; then
  APPLICATIONS=("${APPLICATIONS_OPTIONS[@]}")
else
  case "$APPLICATION" in
  "${APPLICATIONS_OPTIONS[@]}")
    APPLICATIONS=($APPLICATION)
    ;;
  *)
    echo "Error: Invalid application: '$APPLICATION'" >&2
    usage
    exit 1
    ;;
  esac
fi

# Sanitize the Environment argument
if [ "$ENVIRONMENT" == "all" ]; then
  ENVIRONMENT=("${ENVIRONMENTS_OPTIONS[@]}")
else
  case "$ENVIRONMENT" in
  "${ENVIRONMENTS_OPTIONS[@]}")
    ENVIRONMENT=("$ENVIRONMENT")
    ;;
  *)
    echo "Error: Invalid environment: '$ENVIRONMENT'" >&2
    usage
    exit 1
    ;;
  esac
fi

# Push to vault
for APP in "${APPLICATIONS[@]}"; do
  echo -e "${BOLD_TEXT}==================================================${RESET_TEXT}"
  echo -e "${BOLD_TEXT}Pushing secrets for $APP${RESET_TEXT}"
  echo -e "${BOLD_TEXT}==================================================${RESET_TEXT}"
  for ENV in "${ENVIRONMENT[@]}"; do
    echo
    echo -e "${BLUE_TEXT}Pushing to vault: ScottyLabs/$PROJECT_NAME/$ENV/$APP${RESET_TEXT}"
    cat apps/$APP/.env.$ENV | xargs -r vault kv put -mount="ScottyLabs" "$PROJECT_NAME/$ENV/$APP"
  done
  echo
done
