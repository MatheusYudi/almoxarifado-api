// Libs
import { Repository, UpdateResult } from "typeorm";

// Entities
import { Material, MaterialGroup } from "@library/database/entity";

// Repositories
import { BaseRepository } from "./BaseRepository";

/**
 * MaterialRepository
 *
 * Repositório para model de materiais
 */
export class MaterialRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Material;
    }

    /**
     * insert
     *
     * Adiciona um novo material
     *
     * @param material - Dados do material
     *
     * @returns Material adicionado
     */
    public insert(material: Partial<Material>): Promise<Material> {
        const repository: Repository<Material> = this.getConnection().getRepository(Material);
        return repository.save(repository.create(material));
    }

    /**
     * update
     *
     * Altera um material
     *
     * @param material - Dados do material
     *
     * @returns Material alterado
     */
    public update(material: Material): Promise<Material> {
        return this.getConnection().getRepository(Material).save(material);
    }

    /**
     * delete
     *
     * Remove um material pelo ID
     *
     * @param id - ID do material
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<UpdateResult> {
        return this.getConnection().getRepository(Material).softDelete(id);
    }

    /**
     * findByName
     *
     * Busca um material pelo nome
     *
     * @param name - Nome do material
     *
     * @returns Material buscado
     */
    public findByName(name: string): Promise<Material | undefined> {
        return this.getConnection().getRepository(Material).findOne({ name }, { withDeleted: true });
    }

    /**
     * findByBarcode
     *
     * Busca um material pelo código de barras
     *
     * @param barcode - Código de barras do material
     *
     * @returns Material buscado
     */
    public findByBarcode(barcode: string): Promise<Material | undefined> {
        return this.getConnection().getRepository(Material).findOne({ barcode }, { withDeleted: true });
    }

    /**
     * findByMaterialGroup
     *
     * Busca um material pelo grupo
     *
     * @param materialGroup - Grupo
     *
     * @returns Material buscado
     */
    public findByMaterialGroup(materialGroup: MaterialGroup): Promise<Material | undefined> {
        return this.getConnection().getRepository(Material).findOne({ materialGroup });
    }

    /**
     * findOutOfStock
     *
     * Busca os materiais abaixo do estoque mínimo
     *
     * @returns Materiais
     */
    public async findOutOfStock(): Promise<Material[]> {
        const materiais: Material[] = await super.find();

        // Filter items out of stock
        const outOfStock: Material[] = materiais.filter(({ stockQuantity, minimumStock }) => stockQuantity < minimumStock);

        return outOfStock;
    }
}
