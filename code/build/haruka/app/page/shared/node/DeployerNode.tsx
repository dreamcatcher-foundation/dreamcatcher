export default class DeployerNode {
    private static _DAONameField: string;
    private static _DAOTokenNameField: string;
    private static _DAOTokenSymbolField: string;

    public static DAONameField(): string {
        return this._DAONameField;
    }

    public static DAOTokenNameField(): string {
        return this._DAOTokenNameField;
    }

    public static DAOTokenSymbolField(): string {
        return this._DAOTokenSymbolField;
    }

    public static setDAONameField(DAONameField: string): typeof DeployerNode {
        this._DAONameField = DAONameField;
        return this;
    }

    public static setDAOTokenNameField(DAOTokenNameField: string): typeof DeployerNode {
        this._DAOTokenNameField = DAOTokenNameField;
        return this;
    }

    public static setDAOTokenSymbolField(DAOTokenSymbolField: string): typeof DeployerNode {
        this._DAOTokenSymbolField = DAOTokenSymbolField;
        return this;
    }

    
}