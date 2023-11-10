import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 50,
  })
  username: string;
  @Column({
    length: 50,
  })
  password: string;
  @CreateDateColumn()
  createTime: Date;
  @CreateDateColumn()
  updateTime: Date;

  //ACL权限控制为多对多的关系
  @ManyToMany(() => Permission)
  //多对多需要一个中间表，这里声明中间表的名字
  @JoinTable({
    name: 'user_permission',
  })
  permissions: Permission[];
}
