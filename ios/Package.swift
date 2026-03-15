// Swift tools version must be >= 5.9
import PackageDescription

let package = Package(
    name: "DropZone",
    platforms: [
        .iOS(.v15)
    ],
    products: [
        .executable(name: "DropZone", targets: ["DropZone"])
    ],
    targets: [
        .executableTarget(
            name: "DropZone",
            path: "Sources/DropZone"
        )
    ]
)
