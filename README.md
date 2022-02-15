# Unity Package Publish

Publishes Unity package using Packages/com.mycompany.mypackage folder to create upm branch with version tag.
Therefore, you can import the package using [Unity Package Manager](https://docs.unity3d.com/2022.1/Documentation/Manual/upm-ui-giturl.html) with your GitHub repository url with version specified.

## Usage

Use the action inside your workflow yaml file like this:

```yaml
...
- name: Publish Unity package
    uses: cdmvision/action-upm-publish@v1
    with: 
        name: 'com.mycompany.mypackage'
        upmBranch: 'upm'
...

```

See [real world example](https://github.com/ibrahimpenekli/GameToolkit-Localization/blob/develop/.github/workflows/deploy-upm.yml).

## Input Parameters

* **name:** Name of the package from Packages/package.json
* **upmBranch:** Name of the branch that the package will be published. (Default: 'upm')
* **versionPostfix:** This will be added end of the version string. i.e. 1.5.0-postfix (Default: '')
