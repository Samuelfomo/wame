import { Lexicon } from '../model/Lexicon';
import { Lexicon } from '../../Lexicon';

class LexiconRepository {
  public static async create(lexicon: Lexicon): Promise<Lexicon> {
    const newEntry = await Lexicon.create({
      guid: lexicon.guid,
      reference: lexicon.reference,
      english: lexicon.english,
      french: lexicon.french,
      portable: lexicon.portable
    });
    return Lexicon.fromJson(newEntry.toJSON());
  }

  public static async update(lexicon: Lexicon): Promise<Lexicon> {
    await Lexicon.update(
      {
        reference: lexicon.reference,
        english: lexicon.english,
        french: lexicon.french,
        portable: lexicon.portable
      },
      {
        where: { guid: lexicon.guid }
      }
    );
    const updatedEntry = await Lexicon.findOne({ where: { guid: lexicon.guid } });
    return Lexicon.fromJson(updatedEntry!.toJSON());
  }

  public static async delete(lexicon: Lexicon): Promise<void> {
    await Lexicon.destroy({ where: { guid: lexicon.guid } });
  }

  public static async getByGuid(guid: string): Promise<Lexicon | null> {
    const entry = await Lexicon.findOne({ where: { guid } });
    return entry ? Lexicon.fromJson(entry.toJSON()) : null;
  }

  public static async getAll(portable?: boolean): Promise<Lexicon[]> {
    const entries = portable
      ? await Lexicon.findAll({ where: { portable: true } })
      : await Lexicon.findAll();
    return entries.map((entry) => Lexicon.fromJson(entry.toJSON()));
  }
}

export { LexiconRepository };
