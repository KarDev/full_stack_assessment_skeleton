import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserHomeMap } from './UserHomeMap';

@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 36, unique: true })
  uniqueId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  street_address: string;

  @Column({ type: 'varchar', length: 50 })
  state: string;

  @Column({ type: 'varchar', length: 10 })
  zip: string;

  @Column({ type: 'float' })
  sqft: number;

  @Column({ type: 'int' })
  beds: number;

  @Column({ type: 'int' })
  baths: number;

  @Column({ type: 'float' })
  list_price: number;

  @OneToMany(() => UserHomeMap, (userHomeMap) => userHomeMap.home)
  userHomeMaps: UserHomeMap[];
}
