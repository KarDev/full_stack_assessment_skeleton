import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  Column,
} from 'typeorm';
import { User } from './User';
import { Home } from './Home';

@Entity()
export class UserHomeMap {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userHomeMaps, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  @RelationId((userHomeMap: UserHomeMap) => userHomeMap.user)
  userId: number;

  @ManyToOne(() => Home, (home) => home.userHomeMaps, { onDelete: 'CASCADE' })
  home: Home;

  @Column()
  @RelationId((userHomeMap: UserHomeMap) => userHomeMap.home)
  homeId: number;
}
