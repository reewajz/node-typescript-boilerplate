import { ETLState } from '@/interfaces/etl.interface';
import { KeyValueMap } from '@/interfaces/key-value-map.interface';
import { ETLStateRepository } from '@/repositories/etl-state.repositories';
import { injectable } from 'tsyringe';

@injectable()
export class ETLStateService {
  constructor(private etlStateRepository: ETLStateRepository) {}

  async saveMessageToDatabase(message: ETLState): Promise<void> {
    try {
      console.log('Saving message to database:', message);
      // Save message to MySQL database
      await this.etlStateRepository.createOne(message);
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
  }

  async getMessageByBatchId(id: number): Promise<KeyValueMap | undefined> {
    try {
      return await this.etlStateRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error getting message from database:', error);
      return undefined;
    }
  }

  async getAllMessages(): Promise<KeyValueMap[]> {
    try {
      // Get all messages from MySQL database
      return await this.etlStateRepository.findAll();
    } catch (error) {
      console.error('Error getting messages from database:', error);
      return [];
    }
  }
}
