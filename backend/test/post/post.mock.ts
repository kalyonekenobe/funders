import { Decimal, PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { PostEntity } from 'src/post/entities/post.entity';

// Mock data storage
export class MockDataStorage {
  static #data: PostEntity[] = [];
  static #defaultData: PostEntity[] = [
    {
      id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      authorId: '86362221-935b-4b15-a8cb-00be736f1795',
      title: 'Fundraising for the needs of the 95th Brigade of the Armed Forces of Ukraine',
      content: `Title: Supporting Ukraine's 95th Brigade: 
                Fundraising Essentials Introduction: 
                Briefly introduce the 95th Brigade's role in Ukraine's defense. 
                Highlight the urgent need for support to aid these soldiers. 
                Challenges Faced: 
                Outline the specific challenges the brigade encounters. 
                Emphasize the immediate requirements for resources and aid. 
                Impact of Fundraising: 
                Stress the crucial role of donations in meeting the brigade's urgent needs. 
                Explain how contributions directly benefit the soldiers. 
                Current Initiatives: 
                Share ongoing fundraising efforts targeting support for the 95th Brigade. 
                Provide actionable ways for readers to contribute. 
                Transparency and Trust: 
                Ensure donations reach the brigade through trustworthy channels. 
                Emphasize transparency in the fundraising process. 
                Conclusion: 
                Reiterate the importance of support for the 95th Brigade. 
                Encourage readers to participate in aiding these brave soldiers.`,
      fundsToBeRaised: new Decimal(1000000),
      isDraft: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    },
    {
      id: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      authorId: '86362221-935b-4b15-a8cb-00be736f1795',
      title: 'Fundraising for a tank for the 12th Brigade of the Azov National Guard of Ukraine',
      content: `Title: Supporting Ukraine's 12th Brigade: 
                Fundraising for a Tank Ukraine's 12th Brigade of the Azov National Guard requires a critical asset — a tank. 
                This fundraising effort aims to provide essential armored support to bolster their defense. 
                Your contribution directly enhances the brigade's defensive capabilities, aiding them in protecting the nation's sovereignty. 
                Join us in empowering these courageous soldiers with the resources they urgently need. 
                Stand united with Ukraine's 12th Brigade. 
                Contribute today to support their vital mission in safeguarding the country. 
                Every donation makes a difference in fortifying their defense.`,
      fundsToBeRaised: new Decimal(1085655.5),
      isDraft: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    },
    {
      id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      title: 'Fundraising for children and homeless people',
      content: `Title: Giving Hope: 
                Fundraising for Children & the Homeless Fundraising for children and the homeless is a lifeline of hope. 
                Your support provides essentials like education, healthcare, and shelter, shaping brighter futures. 
                Join the cause, be a beacon of compassion. 
                Even a small donation makes a big difference. 
                Together, let's uplift lives and bring hope to those in need.`,
      fundsToBeRaised: new Decimal(15250),
      isDraft: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    },
    {
      id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      authorId: '34594f15-8346-4576-a6e1-8c0af156ed86',
      title: 'Raising funds for animals in the shelter',
      content: `Title: Supporting Shelter Animals: 
                Fundraising for Their Care Animals in shelters await our support and care. 
                Raising funds for these furry friends means providing food, shelter, and medical aid they desperately need. 
                Your contribution directly impacts their well-being. 
                Even a small donation helps offer comfort and a chance for a loving home. 
                Let's stand together for these voiceless beings. 
                Join the cause to ensure they receive the care they deserve. 
                Your kindness matters in making a difference in their lives.`,
      fundsToBeRaised: new Decimal(7300),
      isDraft: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    },
    {
      id: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      title: 'Raising funds for young talents',
      content: `Title: Empowering Young Talents: 
                Fundraising for Aspiring Minds Supporting young talents is an investment in the future. 
                Raising funds for budding artists, scholars, and innovators paves the way for their dreams to flourish. 
                Your contribution fuels their aspirations. 
                Every donation nurtures their potential, enabling them to pursue their passions and make a positive impact. 
                Join the movement to empower these promising minds. 
                Your support fosters creativity, education, and innovation, shaping a brighter tomorrow for our world.`,
      fundsToBeRaised: new Decimal(20000),
      isDraft: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    },
  ];

  static createPostDtoList: CreatePostDto[] = [
    {
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      title: 'Raising funds for young talents',
      content: `1`,
      fundsToBeRaised: new Decimal(20000),
      isDraft: true,
      image: null,
    },
    {
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      title: 'Raising funds for young talents 2',
      content: `1`,
      fundsToBeRaised: new Decimal(20000),
      isDraft: true,
      image: null,
    },
  ];

  static updatePostDtoList: {
    id: string;
    data: UpdatePostDto;
  }[] = [
    { id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc', data: { title: '' } },
    { id: '940860d0-ea49-40cc-bfb1-82633e0b1b10', data: { content: '' } },
    { id: '73c67a90-149e-43d0-966c-91a9a7b3aba3', data: { isDraft: true } },
  ];

  static removePostDtoList: PostEntity[] = [
    {
      id: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      authorId: '86362221-935b-4b15-a8cb-00be736f1795',
      title: 'Fundraising for a tank for the 12th Brigade of the Azov National Guard of Ukraine',
      content: `Title: Supporting Ukraine's 12th Brigade: 
                Fundraising for a Tank Ukraine's 12th Brigade of the Azov National Guard requires a critical asset — a tank. 
                This fundraising effort aims to provide essential armored support to bolster their defense. 
                Your contribution directly enhances the brigade's defensive capabilities, aiding them in protecting the nation's sovereignty. 
                Join us in empowering these courageous soldiers with the resources they urgently need. 
                Stand united with Ukraine's 12th Brigade. 
                Contribute today to support their vital mission in safeguarding the country. 
                Every donation makes a difference in fortifying their defense.`,
      fundsToBeRaised: new Decimal(1085655.5),
      isDraft: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    },
    {
      id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      title: 'Fundraising for children and homeless people',
      content: `Title: Giving Hope: 
                Fundraising for Children & the Homeless Fundraising for children and the homeless is a lifeline of hope. 
                Your support provides essentials like education, healthcare, and shelter, shaping brighter futures. 
                Join the cause, be a beacon of compassion. 
                Even a small donation makes a big difference. 
                Together, let's uplift lives and bring hope to those in need.`,
      fundsToBeRaised: new Decimal(15250),
      isDraft: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  create: jest.fn().mockImplementation((dto: CreatePostDto): Promise<PostEntity> => {
    const created = {
      ...dto,
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
    };

    MockDataStorage.items().push(created);

    return Promise.resolve(created);
  }),
  update: jest.fn().mockImplementation((id: string, dto: UpdatePostDto): Promise<PostEntity> => {
    let exists = MockDataStorage.items().find(item => item.id === id);

    if (!exists) {
      throw new Error('Post with this id does not exist!');
    }

    const updated = { ...exists, ...dto };

    MockDataStorage.setItems(
      MockDataStorage.items().map(item => (item.id === id ? updated : item)),
    );

    return Promise.resolve(updated);
  }),
  remove: jest.fn().mockImplementation((id: string): Promise<PostEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockPostRepository = {
  post: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
    create: jest.fn().mockImplementation((dto: { data: CreatePostDto }): Promise<PostEntity> => {
      const created = {
        ...dto.data,
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        removedAt: null,
      };

      MockDataStorage.items().push(created);

      return Promise.resolve(created);
    }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: { where: { id: string }; data: UpdatePostDto }): Promise<PostEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError('Post with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const updated = { ...exists, ...dto.data };

          MockDataStorage.setItems(
            MockDataStorage.items().map(item => (item.id === dto.where.id ? updated : item)),
          );

          return Promise.resolve(updated);
        },
      ),
    delete: jest.fn().mockImplementation((data: { where: { id: string } }): Promise<PostEntity> => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

      return Promise.resolve(dto);
    }),
  },
};
