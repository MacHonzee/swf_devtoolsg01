# swf_devtoolsg01

This npm library is built for UAF framework Node.js applications
and its main capability is comparing implementation and documentation.

In the future, it will be able to create commands from uuShapes templates,
or create commands as defined in uuAppModelKit.

There are several restrictions to both implementation and documentation:

## Implementation
1. It must be an uuApp with server in Node.js, client and library is not 
supported currently.
2. It must follow common uuApp patterns, such as:
    - errors are saved in app/api/errors folder
    - warnings are saved in app/api/warnings folder
    - validation types are saved in app/api/validation_types folder
    - profiles.json, mappings.json and persistence.json are valid and saved in app/config folder
    - metamodel for uuBT is optional. It will be checked whether folder with name metamodel exists in app/config or env location.
    
## Documentation
1. The documentation must be done in uuBookKit with plugged in uuAppModelKit.
2. It must follow common design patterns, such as:
    - page with uuAppModelKit overview has a code uuApp
    - there is a valid UuAppModelKit.UuApp.Bricks.BasicInfo component on the uuApp page
    - UuCommands validation types is in a section with header _Validation (dtoIntype)_ and nested within `<uu5string.pre>` tags within EmbeddedText component
    - UuCommands have an Algorithm component to properly parse errors and warnings
    - UuSchemas have limits saved in `UuApp.DesignKit.UuAppObjectStoreSchemaLimitList` component
    - UuSchemas have indexes saved in `UuApp.DesignKit.UuAppObjectStoreSchemaIndexList` component
    - UuSchemas have Dao method saved in `UuApp.DesignKit.UuAppObjectStoreSchemaDaoMethodList` component  

# Usage

Correct usage is through npm scripts, although API and direct usage is present too (not wise until stable version is released).

It should not need any extra effort in package.json, as the script list will be automatically updated after each install.

In case it is not updated, add following lines to the package.json:

    "compareDoc": "swf_devtoolsg01_compare_doc all"

# Configuration

You are able to configure the library through file automatically created to env/compare-config.js location.
Every configuration option is already mentioned there in the file.

