

Deployment Procedure:

    1. Deploy all the facets in the extensions directory.

    2. Deploy the contract, and install all the core facets.

    3. Call the 'claimOwnership' method on the contract.

    4. At this point both the 'owner' role and the 'facetOwner' should be in sync with each other.

Change Of Ownership Procedure:

    1. Change the client contract admin by directly calling the IERC173 'transferOwnership'.

    2. Accept ownership from the new account.

    3. Verify that the 'nomineeOwner' is the 'owner' before proceeding to the next step.

    4. Call the 'transferRole' method on the client contract to change the contract's 'owner' role. It's important that both the 'owner' and the 'owner' role are in sync.

Do no uninstall any core facets from the diamond.

Use the provided typescript methods to perform these changes where possible or onchain methods that may be provided.