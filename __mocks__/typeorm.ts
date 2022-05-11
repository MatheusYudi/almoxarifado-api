import { mock } from "jest-mock-extended";
import { Repository, MongoRepository } from "typeorm";

export const repositoryMock = mock<Repository<any>>();
export const mongoRepositoryMock = mock<MongoRepository<any>>();

export const getConnection = jest.fn().mockReturnValue({
    getRepository: () => repositoryMock,
    getMongoRepository: () => mongoRepositoryMock
});

export class BaseEntity {}

export const ObjectIdColumn = jest.fn();
export const PrimaryColumn = jest.fn();
export const Entity = jest.fn();
export const Column = jest.fn();
export const Index = jest.fn();
export const CreateDateColumn = jest.fn();
export const UpdateDateColumn = jest.fn();
export const BeforeInsert = jest.fn();
export const BeforeUpdate = jest.fn();
export const DeepPartial = jest.fn();
export const InsertResult = jest.fn();
