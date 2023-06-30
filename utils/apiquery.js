class ApiQuery {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["sort", "page", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let filter = {};

    if (queryObj.search) {
      const searchValue = queryObj.search;
      const regex = new RegExp(searchValue, "i");
      filter.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }

    if (queryObj.startDate && queryObj.endDate) {
      filter.data = {
        $gte: new Date(queryObj.startDate),
        $lte: new Date(queryObj.endDate),
      };
    }

    this.query.find(filter);

    return this;
  }

  /*
mario@rossi.it
*/

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    } else {
      return this;
    }
  }
}

module.exports = ApiQuery;
