// Libs
import { Repository } from "typeorm";

// Entities
import { InventoryMaterial, Material } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * InventoryMaterialRepository
 *
 * Repositório para model de materiais do inventário
 */
export class InventoryMaterialRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = InventoryMaterial;
    }

    /**
     * insert
     *
     * Adiciona um novo material do inventário
     *
     * @param inventoryMaterial - Dados do material do inventário
     *
     * @returns Material do inventário adicionado
     */
    public insert(inventoryMaterial: Partial<InventoryMaterial>): Promise<InventoryMaterial> {
        // TODO: criar um InventoryMaterial gera movimentação
        const repository: Repository<InventoryMaterial> = this.getConnection().getRepository(InventoryMaterial);
        return repository.save(repository.create(inventoryMaterial));
    }

    /**
     * update
     *
     * Altera um material do inventário
     *
     * @param inventoryMaterial - Dados do material do inventário
     *
     * @returns Material do inventário alterado
     */
    public update(inventoryMaterial: InventoryMaterial): Promise<InventoryMaterial> {
        return this.getConnection().getRepository(InventoryMaterial).save(inventoryMaterial);
    }

    /**
     * findByMaterial
     *
     * Busca um material do inventário pelo material
     *
     * @param material - Material
     *
     * @returns Material do inventário
     */
    public findByMaterial(material: Material): Promise<InventoryMaterial | undefined> {
        return this.getConnection().getRepository(InventoryMaterial).findOne({ material });
    }
}
