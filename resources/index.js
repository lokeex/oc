'use strict';

module.exports = {
  errors: {
    registry: {
      COMPONENT_NAME_NOT_VALID: 'The component\'s name contains invalid characters. Allowed are alphanumeric, _, -',
      COMPONENT_NAME_NOT_VALID_CODE: 'name_not_valid',
      COMPONENT_NOT_FOUND: 'Component "{0}" not found on {1}',
      COMPONENT_VERSION_NOT_FOUND: 'Component "{0}" with version "{1}" not found on {2}',
      COMPONENT_VERSION_ALREADY_FOUND: 'Component "{0}" with version "{1}" can\'t be published to {2} because a component with the same name and version already exists',
      COMPONENT_VERSION_ALREADY_FOUND_CODE: 'already_exists',
       
      CONFIGURATION_EMPTY: 'Registry configuration is empty',
      CONFIGURATION_PREFIX_DOES_NOT_END_WITH_SLASH: 'Registry configuration is not valid: prefix should end with "/"',
      CONFIGURATION_PREFIX_DOES_NOT_START_WITH_SLASH: 'Registry configuration is not valid: prefix should start with "/"',

      LOCAL_PUBLISH_NOT_ALLOWED: 'Components can\'t be published to local repository',
      LOCAL_PUBLISH_NOT_ALLOWED_CODE: 'not_allowed',

      MANDATORY_PARAMETER_MISSING: 'Expected mandatory parameters are missing: {0}',
      MANDATORY_PARAMETER_MISSING_CODE: 'missing',

      PARAMETER_WRONG_FORMAT: 'Parameters are not correctly formatted: {0}',
      PARAMETER_WRONG_FORMAT_CODE: 'wrong type'
    },
    cli: {
      COMPONENTS_LINKED_NOT_FOUND: 'No components linked in the project',
      COMPONENTS_NOT_FOUND: 'no components found in specified path',
      DEV_FAIL: 'An error happened when initialising the dev runner: {0}',
      INIT_FAIL: 'An error happened when initialising the component: {0}',
      NAME_NOT_VALID: 'the name is not valid. Allowed characters are alphanumeric, _, -',
      PACKAGING_FAIL: 'An error happened when creating the package: {0}',
      PUBLISHING_FAIL: 'An error happened when publishing the component: {0}',
      REGISTRY_NOT_FOUND: 'oc registries not found. Run "oc registry add <registry href>"'
    },
    client: {
      serverSideRenderingFail: 'Server-side rendering failed',
    },
    generic: 'An error occurred: {0}',
    s3: {
      DIR_NOT_FOUND: 'Directory "{0}" not found',
      DIR_NOT_FOUND_CODE: 'dir_not_found',

      FILE_NOT_FOUND: 'File "{0}" not found',
      FILE_NOT_FOUND_CODE: 'file_not_found'
    }
  },
  messages: {
    cli: {
      COMPONENT_INITED: 'Component "{0}" created',
      COMPONENT_LINKED: 'oc Component linked',
      COMPONENT_UNLINKED: 'oc Component unlinked',
      COMPONENTS_LINKED_LIST: 'Components linked in project:',
      COMPONENTS_LIST: 'Components available in oc registry: {0}',
      COMPRESSING: 'Compressing -> {0}',
      PACKAGING: 'Packaging -> {0}',
      PUBLISHING: 'Publishing -> {0}',
      REGISTRY_ADDED: 'oc registry added',
      REGISTRY_LIST: 'oc linked registries:',
      REGISTRY_REMOVED: 'oc registry deleted'
    }
  }
};