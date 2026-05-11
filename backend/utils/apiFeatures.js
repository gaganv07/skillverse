export const buildQuery = (query, searchFields = []) => {
  const filters = {};

  if (query.q && searchFields.length) {
    filters.$or = searchFields.map((field) => ({
      [field]: { $regex: query.q, $options: "i" }
    }));
  }

  for (const [key, value] of Object.entries(query)) {
    if (!["q", "page", "limit", "sort"].includes(key) && value) {
      filters[key] = value;
    }
  }

  return filters;
};

export const paginate = (query) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 12, 50);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
