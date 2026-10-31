# The IsoDraw API: one static Go binary. Migrations are embedded and run on
# start, and `isodraw migrate` runs them alone (Fly's release command).
FROM golang:1.26-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/isodraw ./cmd/isodraw

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/isodraw /isodraw
EXPOSE 8080
ENTRYPOINT ["/isodraw"]
