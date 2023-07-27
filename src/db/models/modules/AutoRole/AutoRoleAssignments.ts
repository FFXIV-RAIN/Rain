import {
  Table,
  Column,
  Model,
  BelongsTo,
  PrimaryKey,
  DataType,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Guild } from '../../Guild/Guild';
import { AutoRoleConfig } from './AutoRoleConfig';

@Table
export class AutoRoleAssignments extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => Guild)
  @ForeignKey(() => AutoRoleConfig)
  @Column(DataType.TEXT)
  declare guildId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare enabled: boolean;

  @Column(DataType.ARRAY(DataType.TEXT))
  declare validationRoles?: string[];

  @Column(DataType.ARRAY(DataType.TEXT))
  declare trueRoles?: string[];

  @Column(DataType.ARRAY(DataType.TEXT))
  declare falseRoles?: string[];

  @BelongsTo(() => Guild)
  declare guild: Guild;

  @BelongsTo(() => AutoRoleConfig)
  declare autoRoleConfig: AutoRoleConfig;

  get disabled() {
    return !this.enabled;
  }
}
