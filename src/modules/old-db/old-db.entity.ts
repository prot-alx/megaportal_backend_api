import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('baza')
export class OldBaza {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  nid?: number;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  date?: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'bigint', nullable: true })
  tel?: number;

  @Field({ nullable: true })
  @Column({ length: 40, nullable: true })
  usluga?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  zhaloba?: string;

  @Field({ nullable: true })
  @Column({ length: 300, nullable: true })
  oborud?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  adres?: string;

  @Field({ nullable: true, defaultValue: '---' })
  @Column({ length: 30, nullable: true, default: '---' })
  kt?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  ispoln?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  viyavleno?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ type: 'int', nullable: true, default: 0 })
  zakrytie?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ type: 'int', nullable: true, default: 0 })
  otpisano?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ type: 'int', nullable: true, default: 0 })
  vip?: number;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  datez?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  datep?: Date;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ type: 'int', nullable: true, default: 0 })
  otl?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ type: 'int', nullable: true, default: 0 })
  testmod?: number;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  port?: string;

  @Field({ nullable: true })
  @Column({ length: 25, nullable: true })
  avtor?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  porturez?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ type: 'int', nullable: true, default: 0 })
  prinyal?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  proz?: number;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  proztext?: string;
}
