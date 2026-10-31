# Architecture checks

**Status:** idea · **Priority:** later
**Summary:** Flag likely problems in a diagram, such as a database in a public subnet or a single point of failure.

- **Rules over the diagram's structure** (areas, connections, component types from the catalog): a database or cache inside a public subnet; servers reached directly without a load balancer; one instance of something everything depends on; a queue without a dead-letter queue; a resource in only one availability zone.
- **Shown** as a *Checks* panel listing findings with the items involved, and a small marker on the canvas. Each can be dismissed with a reason, which is kept.
- **Extensible:** rules are data, so teams can add their own later.
