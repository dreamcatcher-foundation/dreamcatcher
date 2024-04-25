
let _local: ({
    staticPath: string;
    solBuildPath: string;
    contracts: ({
        name: string;
        path: string
    })[];
    networks: ({
        name: string;
        url: string;
        key: string;
    })[];
}) = ({
    staticPath: "",
    solBuildPath: "",
    contracts: [],
    networks: []
});

