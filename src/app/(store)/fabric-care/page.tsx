import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Fabric Care | Maison ISIVIS",
  description:
    "Care instructions for your Maison ISIVIS garments. Washing, drying, ironing, and storage guides for bandage, sequin, satin, and polyester fabrics.",
};

export default function FabricCarePage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Fabric Care" }]} className="mb-6" />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Fabric Care
        </h1>
        <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
          Caring for your fabric is essential as it is a valuable resource. To
          ensure the longevity of your new purchase, we have compiled some
          guidelines for you. It is highly recommended to pre-wash any washable
          natural fibres that you plan to wash in the future, as there may be
          some shrinkage. We advise pre-washing in the same manner that you
          intend to wash your future fabric creations, including the drying
          process.
        </p>
        <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
          When washing, always separate light and bright colours to prevent any
          possible colour running in the initial washes. Please keep in mind
          that these care tips are general guidelines, and variations may occur
          depending on the fabric type. If you have any queries or concerns,
          feel free to reach out to us for assistance.
        </p>

        {/* Fabric swatches */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { src: "/images/fabric care/Screenshot 2026-02-24 070817.jpg", alt: "Bandage fabric" },
            { src: "/images/fabric care/002.jpg", alt: "Sequin fabric" },
            { src: "/images/fabric care/003.jpg", alt: "Satin fabric" },
            { src: "/images/fabric care/004.jpg", alt: "Polyester fabric" },
          ].map((img) => (
            <div
              key={img.alt}
              className="relative aspect-square overflow-hidden rounded-luxury-md"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* ===== BANDAGE ===== */}
        <section className="mt-12">
          <h2 className="font-heading text-h2 font-light text-neutral-800">
            Bandage
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Bandage dresses are crafted from a premium blend of spandex, nylon,
            and rayon, offering a form-fitting silhouette that hugs the body
            like a second skin, accentuating and shaping your curves
            beautifully.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Washing
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  <strong>Dry cleaning</strong> – If you prefer to leave the
                  cleaning of your dress to the professionals, dry cleaning is
                  the way to go. While it can be a bit pricey, it takes the
                  hassle out of cleaning at home.
                </li>
                <li>
                  <strong>Washing Machine</strong> – Using a washing machine can
                  be a bit risky, but if you&apos;re feeling confident, opt for
                  the coolest and gentlest cycle. Many machines also offer a
                  hand-washing cycle, which is a safe choice.
                </li>
                <li>
                  <strong>Hand Wash</strong> – For a gentle hand wash, the
                  bathtub is the perfect spot. Lay the dress flat during washing
                  to maintain its shape and elasticity. Use soapy water to
                  gently wash the dress, then rinse it off without wringing or
                  squeezing it. Just gently press out the excess water.
                </li>
                <li>
                  <strong>Quick Clean</strong> – If you only have a small stain
                  to deal with, dampen the area with cold water and gently rub
                  in some soap. Rinse and pat dry for a quick and easy clean.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Drying
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                Drying your dress is straightforward. Simply lay it flat on a
                clothes rack or towel to dry, and remember to turn it
                occasionally. Avoid hanging the dress on a hanger while drying,
                as this can cause it to lose its shape and affect its elasticity.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Ironing
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                It&apos;s best to iron the dress while it is still slightly
                damp. Use a low heat setting on your iron and iron the dress
                inside out to avoid iron marks. If you need to iron the dress
                when it&apos;s dry, place a damp cloth between the dress and the
                iron to prevent any damage.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Storage
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                When it comes to dresses with sleeves and straps, it&apos;s best
                to hang them up on a hanger, but avoid using wire hangers. If
                hanging isn&apos;t an option due to a sleeveless style or lack
                of closet space, try laying the dress flat in a drawer. If
                folding is necessary, do so carefully to avoid creating creases
                that would undo your ironing efforts. Keep the dress hung up or
                stored flat with ample space to maintain its shape and prevent
                wrinkles.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="my-12 border-neutral-200" />

        {/* ===== SEQUIN ===== */}
        <section>
          <h2 className="font-heading text-h2 font-light text-neutral-800">
            Sequin
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Sequins are decorative embellishments, typically made of plastic or
            metal, that are added to fabrics like cotton, silk, wool, or
            synthetics. They are commonly found adorning dresses, skirts, and
            blouses.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Washing
              </h3>
              <div className="mt-3 space-y-4 text-body-sm leading-relaxed text-neutral-600">
                <div>
                  <p className="font-medium text-neutral-800">Dry Cleaning</p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                      Choose a reputable dry cleaner that specialises in caring
                      for evening gowns and wedding dresses.
                    </li>
                    <li>
                      Provide the dry cleaner with fabric off-cuts to test
                      before cleaning the adorned garment.
                    </li>
                    <li>
                      Ensure the dry cleaner uses the &lsquo;F&rsquo;
                      (hydrocarbon solvent) cleaning method or Green Earth dry
                      cleaning method.
                    </li>
                    <li>
                      For garments with metal decorations, ask the dry cleaner
                      to &lsquo;foil&rsquo; the decorations to prevent cracking
                      or tarnishing during cleaning. Alternatively, request
                      hand-cleaning or removal and reattachment of decorations.
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-neutral-800">Hand Washing</p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                      Fasten all zips and buttons, then turn the garment inside
                      out.
                    </li>
                    <li>
                      Fill a clean bowl or sink with hand-warm water (up to
                      30&deg;C) and add a gentle detergent designed for delicate
                      fabrics.
                    </li>
                    <li>
                      Submerge the garment and wash gently with a
                      plunging/swishing motion. Avoid excessive rubbing to
                      protect beads and sequins.
                    </li>
                    <li>
                      Rinse the garment in cool water until the water runs
                      clear.
                    </li>
                    <li>
                      Gently squeeze out excess water without wringing.
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-neutral-800">
                    Machine Washing
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                      Fasten zips and buttons and turn the garment inside out.
                    </li>
                    <li>
                      Place the garment in a mesh laundry bag or pillowcase
                      before washing.
                    </li>
                    <li>
                      Wash the garment alone on a delicate cycle at a maximum of
                      30&deg;C with a suitable detergent for delicate fabrics.
                    </li>
                    <li>
                      Use the lowest spin cycle setting to prevent damage.
                    </li>
                    <li>
                      Check for any loose embellishments that may have come off
                      during washing.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Drying
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Lay the inside-out garment on a clean, dry, and lint-free
                  towel, then roll it up and gently squeeze to remove excess
                  water. Repeat with another dry towel if needed.
                </li>
                <li>
                  Carefully turn the garment right side out and allow it to air
                  dry on a flat surface.
                </li>
                <li>
                  Avoid putting beaded or sequined garments in a tumble dryer as
                  the sequins may melt and the drum&apos;s movement can cause
                  damage.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Ironing
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                For garments adorned with beads and sequins, avoid ironing to
                prevent damage. To remove creases:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Turn the garment inside out and use a clothes steamer (for
                  washable fabrics only). Keep the steam wand about 30cm away
                  from the fabric.
                </li>
                <li>
                  Hang the garment in a steamy bathroom to help release
                  wrinkles.
                </li>
                <li>
                  Ensure the garment is completely dry before wearing to prevent
                  the formation of new creases.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Repair
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                If you notice a loose bead, sequin, or thread on your garment,
                secure it with a few stitches as soon as possible to prevent
                further loss. If a significant number of beads or sequins have
                come off, it&apos;s best to have the garment repaired by a
                specialist to ensure proper restoration.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Storage
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Prior to storing, ensure the garment is clean and well-aired.
                </li>
                <li>
                  Hang embellished garments on sturdy, padded, non-slip hangers,
                  utilising the garment hanging loops for added support. Avoid
                  crushing the garments in the wardrobe and consider using a
                  garment cover to maintain cleanliness.
                </li>
                <li>
                  For heavier garments, wrap them in acid-free tissue paper, fold
                  carefully, and store flat to preserve the embellishments.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="my-12 border-neutral-200" />

        {/* ===== SATIN ===== */}
        <section>
          <h2 className="font-heading text-h2 font-light text-neutral-800">
            Satin
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Fabric woven with floating yarns made of silk, rayon, acetate,
            nylon, polyester, or a blend. Known for its luxurious, smooth,
            lustrous, and draping qualities.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Washing
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Handwashing is always the best and safest method for washing
                  satin.
                </li>
                <li>
                  Add 2 capfuls or a squirt of Delicate Wash to a washbasin or
                  sink filled with cool water.
                </li>
                <li>
                  Submerge the item and gently agitate the water with your hands
                  to evenly distribute soap. Soak for up to 30 minutes.
                </li>
                <li>
                  Rinse well by running cool water through the item until the
                  water is no longer soapy.
                </li>
                <li>
                  Do not wring. Instead, press the water out of the item.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Drying
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                Air drying is the best option for satin fabrics. Satin should
                never be wrung out to remove excess water. Get the excess water
                out by laying the item flat on a dry towel and rolling the towel
                up with the satin item inside. Apply gentle pressure to the
                towel to force out the excess water. Unroll the towel and remove
                the item. Lay the satin item on a dry towel and let it air dry.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Ironing
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                It takes special care to iron satin. Use a warm iron and
                absolutely no steam. Always press satin on the wrong side of the
                fabric and keep a pressing cloth between the iron and the fabric.
                A thin piece of white cotton such as a handkerchief works well
                as a pressing cloth. Applying a hot iron directly to satin
                fabric can leave behind an impression of the iron&apos;s plate
                and can damage the fabric.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Storage
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Satin items such as a skirt or dress can be hung on a hanger;
                  however, be mindful of clips because they can leave marks on
                  the material.
                </li>
                <li>Always store items clean.</li>
                <li>
                  We recommend storing in a breathable cotton hanging storage
                  bag to protect items from bugs.
                </li>
                <li>
                  Storing in plastic encourages yellowing and can trap
                  mildew-causing moisture, a prime environment for bugs.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="my-12 border-neutral-200" />

        {/* ===== POLYESTER ===== */}
        <section>
          <h2 className="font-heading text-h2 font-light text-neutral-800">
            Polyester
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Polyester is a versatile and durable fabric that can easily be
            washed at home. Here are some key instructions for washing, drying,
            ironing, and storing polyester clothing.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Washing
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Machine wash polyester items like jackets with a gentle
                  detergent on the normal cycle using warm or cool water.
                </li>
                <li>
                  Wash similar colours and fabrics together to prevent colour
                  bleeding.
                </li>
                <li>
                  For added brightness, consider using a non-chlorine bleach
                  alternative in each wash cycle.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Drying
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Air dry polyester garments or tumble dry on a medium
                  temperature setting.
                </li>
                <li>
                  Polyester is generally wrinkle-resistant but can be ironed on a
                  low heat setting if needed. Steam can also help smooth out
                  wrinkles.
                </li>
                <li>
                  Refresh between washes by spritzing with a fabric freshener.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Ironing
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                Polyester&apos;s non-wrinkling properties make it easy to care
                for, but heavy wrinkles can be removed with a steam iron on a
                medium heat setting. A clothing steamer can also be effective.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-h4 font-light text-neutral-800">
                Storage
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
                <li>
                  Hang polyester garments or stack them flat to prevent wrinkles.
                  Folding may cause creases.
                </li>
                <li>
                  Store polyester items in a plastic tub or garment bag to
                  protect them from dust during long-term storage.
                </li>
                <li>
                  Ensure freshly laundered items are completely dry before
                  storing. Loosely knit pieces can be folded and placed in
                  drawers, while woven or tightly knit items should be hung to
                  maintain their shape.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <p className="text-body-sm text-neutral-600">
            Need help with garment care? Email us at{" "}
            <a
              href="mailto:info@isivislondon.com"
              className="font-medium text-brand-purple hover:underline"
            >
              info@isivislondon.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
