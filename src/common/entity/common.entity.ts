import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Most common entity for course, user, and more
 * Provide all entity with id, created, deleted, and updated date
 */
export abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * UUID column
   */
  @Generated('uuid')
  @Column()
  uuid: string;

  /**
   * created date column
   */
  @CreateDateColumn()
  createdDate: Date;

  /**
   * updated date column
   */
  @UpdateDateColumn()
  updatedDate: Date;

  /**
   * delete date column
   */
  @DeleteDateColumn()
  deletedDate: Date;

  /**
   * disable a row column
   */
  @Column('boolean', { default: false })
  isDeleted: boolean;
}
