import {
  Badge,
  Button,
  CardDescription,
  CardRoot,
  CardTitle,
  DiffLine,
  Navbar,
  NavbarLink,
  NavbarLogo,
  NavbarSpacer,
  ScoreRing,
  TableRow,
  TableRowCode,
  TableRowLang,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
  Toggle,
} from "@/components/ui";
import { CodeBlock } from "@/components/ui";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

export default async function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background p-8 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-accent-foreground">Components Library</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// buttons"}</h2>
        <div className="space-y-8 p-6 bg-card rounded-lg border border-border">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button>$ roast_my_code</Button>
              <Button variant="outline" size="outline">
                $ share_roast
              </Button>
              <Button variant="link" size="link">
                $ view_all {">>"}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Icon button">
                +
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// toggle"}</h2>
        <div className="space-y-8 p-6 bg-card rounded-lg border border-border">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">States</h3>
            <div className="flex flex-wrap gap-8">
              <Toggle label="roast mode" defaultChecked />
              <Toggle label="roast mode" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// badge_status"}</h2>
        <div className="space-y-8 p-6 bg-card rounded-lg border border-border">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Variants</h3>
            <div className="flex flex-wrap gap-6">
              <Badge variant="critical">critical</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="good">good</Badge>
              <Badge variant="verdict">needs_serious_help</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// cards"}</h2>
        <div className="p-6 bg-card rounded-lg border border-border">
          <CardRoot>
            <Badge variant="critical">critical</Badge>
            <CardTitle>using var instead of const/let</CardTitle>
            <CardDescription>
              the var keyword is function-scoped rather than block-scoped, which can lead to
              unexpected behavior and bugs. modern javascript uses const for immutable bindings and
              let for mutable ones.
            </CardDescription>
          </CardRoot>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// code_block"}</h2>
        <div className="p-6 bg-card rounded-lg border border-border">
          <CodeBlock
            code={sampleCode}
            language="javascript"
            fileName="calculate.js"
            showDots={false}
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// diff_line"}</h2>
        <div className="p-6 bg-card rounded-lg border border-border">
          <div className="flex flex-col gap-0 p-4 bg-bg-page w-[560px]">
            <DiffLine variant="removed" code="var total = 0;" />
            <DiffLine variant="added" code="const total = 0;" />
            <DiffLine variant="context" code="for (let i = 0; i < items.length; i++) {" />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// score_ring"}</h2>
        <div className="p-6 bg-card rounded-lg border border-border">
          <div className="flex flex-wrap gap-6">
            <ScoreRing score={3.5} />
            <ScoreRing score={9.5} size="lg" />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// table_row"}</h2>
        <div className="p-6 bg-card rounded-lg border border-border">
          <div className="flex flex-col w-full">
            <TableRow
              rank="#1"
              score={9.8}
              scoreVariant="good"
              codePreview="function calculateTotal(items) { var total = 0;"
              language="javascript"
            />
            <TableRow
              rank="#2"
              score={2.1}
              scoreVariant="critical"
              codePreview="function calculateTotal(items) { var total = 0;"
              language="javascript"
            />
            <TableRow
              rank="#3"
              score={5.4}
              scoreVariant="warning"
              codePreview="function calculateTotal(items) { var total = 0;"
              language="python"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{"// navbar"}</h2>
        <div className="p-6 bg-card rounded-lg border border-border">
          <Navbar>
            <NavbarLogo />
            <NavbarSpacer />
            <NavbarLink href="#">leaderboard</NavbarLink>
          </Navbar>
        </div>
      </section>
    </div>
  );
}
