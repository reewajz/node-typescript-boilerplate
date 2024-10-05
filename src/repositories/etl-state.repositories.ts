import { ETLStateEntity } from '@/entities/etl-state.entity';
import { ETLState } from '@/interfaces/etl.interface';
import { injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class ETLStateRepository extends Repository<ETLStateEntity> {
  constructor(private dataSource: DataSource) {
    super(ETLStateEntity, dataSource.createEntityManager());
  }

  async createOne(createState: ETLState): Promise<ETLStateEntity> {
    console.log('Creating new tenant:', createState);
    const newTenant = this.create({
      status: createState.status,
      etl: createState.etl,
      batchId: createState.batchId,
    });
    console.log('nnnn::', newTenant);
    await this.save(newTenant);

    return newTenant;
  }

  async updateOne(
    id: string,
    updateState: Partial<ETLState>,
  ): Promise<ETLStateEntity | undefined> {
    const existingState = await this.findOneBy({ batchId: id });
    if (!existingState) {
      return undefined;
    }

    Object.assign(existingState, updateState);
    await this.save(existingState);

    return existingState;
  }

  async getOne(batchId: string): Promise<ETLStateEntity | undefined> {
    return this.findOneBy({ batchId });
  }

  async deleteOne(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected > 0;
  }

  async findAll(): Promise<ETLStateEntity[]> {
    return this.find();
  }
}
