export const generateId = (id, prefix, length) => {
    return prefix + '0'.repeat(length - id.toString().length) + id;
};
