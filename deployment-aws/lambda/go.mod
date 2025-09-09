module simple-crud-board-lambda

go 1.21

require (
	github.com/aws/aws-lambda-go v1.41.0
	github.com/aws/aws-sdk-go-v2 v1.21.0
	github.com/aws/aws-sdk-go-v2/config v1.18.45
	github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue v1.10.42
	github.com/aws/aws-sdk-go-v2/service/dynamodb v1.21.5
	github.com/awslabs/aws-lambda-go-api-proxy v0.16.0
	github.com/gin-contrib/cors v1.4.0
	github.com/gin-gonic/gin v1.9.1
	github.com/google/uuid v1.3.1
)

// TODO: 以下の依存関係を確認し、必要に応じて追加してください
// require (
//     github.com/aws/aws-sdk-go-v2/credentials v1.13.43
//     github.com/aws/aws-sdk-go-v2/feature/ec2/imds v1.13.13
//     github.com/aws/aws-sdk-go-v2/internal/configsources v1.1.41
//     github.com/aws/aws-sdk-go-v2/internal/endpoints/v2 v2.4.35
//     github.com/aws/aws-sdk-go-v2/service/internal/accept-encoding v1.9.15
//     github.com/aws/aws-sdk-go-v2/service/internal/endpoint-discovery v1.7.35
//     github.com/aws/aws-sdk-go-v2/service/sso v1.15.0
//     github.com/aws/aws-sdk-go-v2/service/ssooidc v1.17.1
//     github.com/aws/aws-sdk-go-v2/service/sts v1.23.0
//     github.com/aws/smithy-go v1.14.2
//     github.com/bytedance/sonic v1.9.1
//     github.com/chenzhuoyu/base64x v0.0.0-20221115062448-fe3a3abad311
//     github.com/gabriel-vasile/mimetype v1.4.2
//     github.com/gin-contrib/sse v0.1.0
//     github.com/go-playground/locales v0.14.1
//     github.com/go-playground/universal-translator v0.18.1
//     github.com/go-playground/validator/v10 v10.14.0
//     github.com/goccy/go-json v0.10.2
//     github.com/jmespath/go-jmespath v0.4.0
//     github.com/json-iterator/go v1.1.12
//     github.com/klauspost/cpuid/v2 v2.2.4
//     github.com/leodido/go-urn v1.2.4
//     github.com/mattn/go-isatty v0.0.19
//     github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd
//     github.com/modern-go/reflect2 v1.0.2
//     github.com/pelletier/go-toml/v2 v2.0.8
//     github.com/twitchyliquid64/golang-asm v0.15.1
//     github.com/ugorji/go/codec v1.2.11
//     golang.org/x/arch v0.3.0
//     golang.org/x/crypto v0.9.0
//     golang.org/x/net v0.10.0
//     golang.org/x/sys v0.8.0
//     golang.org/x/text v0.9.0
//     gopkg.in/yaml.v3 v3.0.1
// )