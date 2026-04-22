/**
 * tagService.js
 *
 * Business logic layer for tag operations.
 * TODO: Implement as Tag Manager UI is built.
 */

import { getTags, createTag, renameTag, deleteTag } from '../api/tagsApi';

export const tagService = {
  getAll: async () => {
    const res = await getTags();
    return res.data.data;
  },

  create: async (tagData) => {
    const res = await createTag(tagData);
    return res.data.data;
  },

  rename: async (id, tagData) => {
    const res = await renameTag(id, tagData);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await deleteTag(id);
    return res.data;
  },
};
