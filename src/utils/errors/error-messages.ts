export const ERROR_MESSAGES = {
  getEmptyRequestMessage(type: string) {
    return `Request ${type} cannot be empty`;
  },

  getNotFoundMessage(entityName: string) {
    return `${entityName} Not Found`;
  },

  getUniqueConstraintMessage(entityName: string, prop: string) {
    return `${entityName} with this ${prop} already exists`;
  },

  getForeignKeyConstraintMessage(entityName: string, relatedEntitiesName: string, action: string) {
    return `Cannot ${action} ${entityName} because it has related ${relatedEntitiesName}`;
  },
} as const;
