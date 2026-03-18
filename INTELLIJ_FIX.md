# Fix IntelliJ "Outside of module source root" Error

If the warning persists after reloading Maven, do a **clean re-import**:

## Step 1: Close IntelliJ completely

## Step 2: Delete the .idea folder
```
Delete: C:\ProLinkApp\.idea
```

## Step 3: Reopen the project
1. Open IntelliJ IDEA
2. **File** → **Open**
3. Select **C:\ProLinkApp** (the folder containing pom.xml)
4. Choose **Open as Project** (NOT "Trust Project")
5. When prompted, select **Load Maven Project** or **Import Maven Project**

## Step 4: Wait for Maven import
Let IntelliJ finish indexing and importing all modules (check the progress bar at the bottom).

## Step 5: If still broken - Mark source root manually
1. In Project view, expand **backend** → **post-service**
2. Right-click **src/main/java**
3. **Mark Directory as** → **Sources Root**

The folder should turn blue/green. The warning should disappear.
