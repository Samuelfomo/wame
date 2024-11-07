import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface LexiconAttributes {
  id: number;
  guid: string;
  reference: string;
  english: string;
  french: string;
  portable: boolean;
}

interface LexiconCreationAttributes extends Optional<LexiconAttributes, 'id'> {}

class Lexicon extends Model<LexiconAttributes, LexiconCreationAttributes> implements LexiconAttributes {
  public id!: number;
  public guid!: string;
  public reference!: string;
  public english!: string;
  public french!: string;
  public portable!: boolean;
}

Lexicon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    guid: {
      type: DataTypes.STRING(36),
      allowNull: false
    },

public id: number;
public guid: string;
public reference: string;
public english: string;
public french: string;
public portable: boolean;

  constructor(
    reference: string,
    english: string,
    french: string,
    portable: boolean,
    id?: number,
    guid?: string
) {
    this.id = id || 0;
    this.guid = guid || '';
    this.reference = reference;
    this.english = english;
    this.french = french;
    this.portable = portable;
  }

public static fromJson(json: any): Lexicon {
    return new Lexicon(
      json.reference,
      json.english,
      json.french,
      json.portable,
      json.id,
      json.guid
    );
  }

public toJson(): any {
    return {
      guid: this.guid,
      reference: this.reference,
      english: this.english,
      french: this.french,
      portable: this.portable
    };
  }
}

export { Lexicon };

reference: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    english: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    french: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    portable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Lexicon',
    tableName: 'lexicon',
    timestamps: false
  }
);

export { Lexicon };
