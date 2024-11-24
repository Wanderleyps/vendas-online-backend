import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { stateMock } from '../__mocks__/state.mock';
import { StateEntity } from '../entities/state.entity';
import { StateService } from '../state.service';

describe('StateService', () => {
  let service: StateService;
  let stateRepository: Repository<StateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        {
          provide: getRepositoryToken(StateEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([stateMock]),
          },
        },
      ],
    }).compile();

    service = module.get<StateService>(StateService);
    stateRepository = module.get<Repository<StateEntity>>(
      getRepositoryToken(StateEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(stateRepository).toBeDefined();
  });

  it('should be return list of stats', async () => {
    const states = await service.getAllState();

    expect(states).toEqual([stateMock]);
  });

  it('should be return error in exception', async () => {
    jest.spyOn(stateRepository, 'find').mockRejectedValueOnce(new Error());

    expect(service.getAllState()).rejects.toThrow();
  });
});
