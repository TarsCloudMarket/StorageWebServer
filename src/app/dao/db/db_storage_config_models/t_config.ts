/* jshint indent: 1 */

import { Table, PrimaryKey, Column, Model, DataType, Unique, Index, Default, CreatedAt, UpdatedAt, AutoIncrement } from "sequelize-typescript";

@Table({ tableName: "t_config", freezeTableName: true, timestamps: false, })
export default class tConfig extends Model<tConfig> {

    @AutoIncrement
    @PrimaryKey
    @Column({ type: DataType.INTEGER })
    public id!: number;

    @Unique("idx")
    @Column({ type: DataType.STRING(64) })
    public obj!: string;

    @Column({ type: DataType.STRING(64) })
    public name!: string;

    @Column({ type: DataType.STRING(64) })
    public type!: string

    @Index
    @Default(new Date())
    @CreatedAt
    @Column({ type: DataType.DATE })
    public create_time!: Date

    @Index
    @Default(new Date())
    @UpdatedAt
    @Column({ type: DataType.DATE })
    public update_time!: Date

}
