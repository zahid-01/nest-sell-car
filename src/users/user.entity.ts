import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  log() {
    console.log(' Inserted ', this.password, this.id, this.email);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Updated', this.password, this.id, this.email);
  }
  @AfterRemove()
  logRemove() {
    console.log('Removed', this.password, this.id, this.email);
  }
}
