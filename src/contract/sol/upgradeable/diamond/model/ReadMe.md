░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ______   _____    ___    _____   __  __   ____    _   _   ____    _____   _   _   _____
   |  __  | |  _  |  /   \  |  ___| |  \/  | |  __|  | | | | |  __|  |  ___| | | | | |  _  |
   | |  | | | | | | |  _  | | |___  |      | | |     | |_| | | |     | |___  | |_| | | | | |
   | |__| | | |_| | | |_| | |  ___| | |\/| | | |     |  _  | | |     |  ___| |  _  | | |_| |
   |______| |_____| |_____| |_|___  |_|  |_| |_|     |_| |_| |_|     |_|___  |_| |_| |_____|

   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

  DIAMOND CONTRACT STORAGE AND FOLDER STRUCTURE GUIDELINES:

  ◢◣ Different models have different storage layouts to avoid collisions.
  ◢◣ Some models are generalized (e.g., ERC20 storage), while others are specialized, such as a dedicated ERC20 layout.
  ◢◣ It is essential to follow these rules to prevent facets from bricking or corrupting the diamond.

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

 RULES:
 1.  DO NOT CHANGE THE ORDER OF A MODEL'S STORAGE LAYOUT.
 2.  YOU CAN ADD ADDITIONAL STORAGE UNDER THE EXISTING LAYOUT.
 3.  ALL EXTENSIONS SHOULD HAVE A FACET FOLDER AND AN API FOLDER.

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░


 +---------------------------------------+
 |       ◢◣ STORAGE LAYOUT ◢◣            |
 |   (DO NOT CHANGE EXISTING LAYOUT)     |
 |                                       |
 | +-----------------------------------+ |
 | |     ◢◣ NEW STORAGE ◢◣              | |
 | |  (ADD UNDER EXISTING LAYOUT)       | |
 | +-----------------------------------+ |
 +---------------------------------------+

 +-------------------+         +------------------+
 |   ◢◣ FACET FOLDER ◢◣       |    ◢◣ API FOLDER ◢◣  |
 |-------------------|         |------------------|
 | External methods  |         | Internal methods |
 | (Endpoints for    |         | (Implementations)|
 | interacting with  |         |                  |
 | the diamond)      |         | Can be reused    |
 |                   |         | across modules   |
 | **Avoid method    |         |                  |
 | name conflicts**  |         |                  |
 +-------------------+         +------------------+

 +-------------------------+
 |   ◢◣ DIAMOND CONTRACT ◢◣  |
 | (Holds storage and links |
 |   to facet APIs)         |
 +-------------------------+

 +------------------+   +--------------+   +------------------+
 |                  |   |              |   |                  |
 |    ◢◣ STORAGE ◢◣  | =>|   ◢◣ API ◢◣   | =>|    ◢◣ FACET ◢◣   |
 |                  |   | (Internal    |   | (External        |
 |                  |   |  Logic)      |   |  Endpoints)      |
 +------------------+   +--------------+   +------------------+

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

 /**
  * @title Diamond
  * @dev Implements the Diamond Standard (EIP-2535) for a modular smart contract system, where functionality
  *      is broken up into separate "facets" that share a single storage layer. This contract allows
  *      the owner to manage facets by adding, removing, or replacing function selectors.
  *      - The Diamond cannot call itself and is non-reentrant by default due to its built-in router.
  *      - It abstracts complex management processes into easy-to-use methods like `connect`, `disconnect`, 
  *        and `reconnect` to manage facets and their function selectors.
  */
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
