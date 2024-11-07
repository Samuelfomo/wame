import { Lexicon } from '../../Lexicon';
import { LexiconRepository } from '../lexicon/repository/LexiconRepository';

class LexiconService {
  public static async create(lexicon: Lexicon): Promise<Lexicon> {
    return await LexiconRepository.create(lexicon);
  }

  public static async update(lexicon: Lexicon): Promise<Lexicon> {
    return await LexiconRepository.update(lexicon);
  }

  public static async delete(lexicon: Lexicon): Promise<void> {
    await LexiconRepository.delete(lexicon);
  }

  public static async getByGuid(guid: string): Promise<Lexicon | null> {
    return await LexiconRepository.getByGuid(guid);
  }

  public static async getAll(portable?: boolean): Promise<Lexicon[]> {
    return await LexiconRepository.getAll(portable);
  }
}

export { LexiconService };


async function getCities(): Promise<CitiesApiResponse> {
  try {
    const response: AxiosResponse = await axios.get(Endpoints.cities);
    if (response.data.status === 1) {
      return CitiesApiResponse.fromJson(response.data);
    } else {
      throw {
        request: { path: '' },
        response: {
          request: { path: '' },
          status: 201,
          data: response.data
        }
      } as AxiosError;
    }
  } catch (error) {
    throw mapToError(error);
  }
}
