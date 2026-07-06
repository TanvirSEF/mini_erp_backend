import { Model, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  private searchableFields: string[] = [];

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    this.searchableFields = searchableFields;
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    delete queryObj.searchTerm;
    delete queryObj.sort;
    delete queryObj.page;
    delete queryObj.limit;

    this.modelQuery = this.modelQuery.find(queryObj);
    return this;
  }

  sort() {
    const sortBy = (this?.query?.sort as string) || '';
    if (sortBy) {
      this.modelQuery = this.modelQuery.sort(sortBy);
    }
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async totalCount() {
    const conditions: Record<string, unknown> = {};
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      conditions.$or = this.searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
    }
    const filterObj = { ...this.query };
    delete filterObj.searchTerm;
    delete filterObj.sort;
    delete filterObj.page;
    delete filterObj.limit;
    Object.assign(conditions, filterObj);

    const model = this.modelQuery.model as unknown as Model<T>;
    return model.countDocuments(conditions);
  }
}

export default QueryBuilder;
