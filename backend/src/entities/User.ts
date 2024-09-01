import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserHomeMap } from './UserHomeMap';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 36, unique: true })
  uniqueId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @OneToMany(() => UserHomeMap, (userHomeMap) => userHomeMap.user)
  userHomeMaps: UserHomeMap[];
}
