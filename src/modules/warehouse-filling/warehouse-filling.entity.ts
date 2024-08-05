import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Material } from '../material/material.entity';

@Entity('warehouse_filling')
export class WarehouseFilling {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column()
  count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
