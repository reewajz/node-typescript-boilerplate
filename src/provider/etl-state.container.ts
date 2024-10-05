// src/di/container.ts
import { container } from 'tsyringe';
import { ETLStateRepository } from '@/repositories/etl-state.repositories';
import { ETLStateService } from '@/services/etl-state.service';
import { DataSource } from 'typeorm';
import { AppDataSource } from '@/database';
import { ETLStateEntity } from '@/entities/etl-state.entity';
// import { App } from '@/app';

export function setupContainer() {
  // container.registerSingleton<App>('App', App);
  // container.registerSingleton<ETLStateRepository>('ETLStateRepository', ETLStateRepository);
  // container.registerSingleton<ETLStateService>('ETLStateService', ETLStateService);
  container.register('ETLStateRepository', { useClass: ETLStateRepository });
  container.register('ETLStateService', { useClass: ETLStateService });

  const r = AppDataSource.getRepository(ETLStateEntity).extend({});
  container.registerInstance('ETLStateRepository', r);
}

export { container };
