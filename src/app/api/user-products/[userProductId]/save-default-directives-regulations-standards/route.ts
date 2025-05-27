import { createClient } from "@/lib/supabase/server";
import { openaiClient } from "@/lib/utils/openai";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint to save default GPSR compliance requirements for a product.
 * This endpoint:
 * 1. Validates user authentication and product existence
 * 2. Uses OpenAI to determine relevant directives, regulations, and standards
 * 3. Saves the compliance data to respective database tables
 *
 * @param request - NextRequest containing categoryName and productName
 * @param params - Contains userProductId from the URL
 * @returns Saved directives, regulations, and standards data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userProductId: string }> }
) {
  try {
    const { userProductId } = await params;
    const { productName, categoryName } = await request.json();

    // Validate required fields
    if (!productName || !categoryName) {
      return NextResponse.json(
        { error: "Product name and category name are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user product exists
    const userProduct = await supabase
      .from("user_products")
      .select("*")
      .eq("id", userProductId)
      .single();

    if (!userProduct) {
      return NextResponse.json(
        { error: "User product not found" },
        { status: 404 }
      );
    }

    // Define the expected response structure for OpenAI
    const schema = {
      directives: [
        {
          directive_name: "string",
          directive_number: "string",
          directive_edition_date: "string",
          directive_description: "string",
        },
      ],
      regulations: [
        {
          regulation_number: "string",
          regulation_name: "string",
          regulation_description: "string",
          regulation_edition_date: "string",
        },
      ],
      standards: [
        {
          ref_no: "string",
          edition_or_date: "string",
          title: "string",
        },
      ],
    };

    // Request compliance data from OpenAI
    const result = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert who provides detailed lists of directives, regulations, and standards that are valid for GPSR compliance of products in the specified category within the EU and UK scope.",
        },
        {
          role: "user",
          content: `Please list the Directives, Regulations, and Standards data that are valid for GPSR compliance of "${productName}" products in the "${categoryName}" category in the EU and UK in the following format:\n${JSON.stringify(
            schema
          )}\n Always return results in English and provide only the JSON data. Please return a valid string in JSON format and properly escape quotation marks.`,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 500,
    });

    const data = result?.choices[0]?.message?.content;

    if (!data) {
      return NextResponse.json(
        { error: "Failed to process GPSR data" },
        { status: 500 }
      );
    }

    // Clean and parse the OpenAI response
    const jsonString = data
      ?.replace(/```json|```/g, "")
      .trim()
      .replace(/\n/g, " ") // Remove newlines
      .replace(/\s+/g, " "); // Replace multiple spaces with single space

    let jsonObject: typeof schema;
    try {
      jsonObject = JSON.parse(jsonString) as typeof schema;
    } catch (error) {
      console.error("JSON Parse Error Details:", error);
      throw error;
    }

    // Save directives to database
    const {
      data: userProductUserDirectives,
      error: userProductUserDirectivesError,
    } = await supabase
      .from("user_product_user_directives")
      .insert(
        jsonObject.directives.map((directive) => ({
          directive_number: directive.directive_number,
          directive_name: directive.directive_name,
          directive_description: directive.directive_description,
          directive_edition_date: directive.directive_edition_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_product_id: userProductId,
          user_id: user.id,
        }))
      )
      .select();

    if (userProductUserDirectivesError) throw userProductUserDirectivesError;

    // Save regulations to database
    const {
      data: userProductUserRegulations,
      error: userProductUserRegulationsError,
    } = await supabase
      .from("user_product_user_regulations")
      .insert(
        jsonObject.regulations.map((regulation) => ({
          regulation_number: regulation.regulation_number,
          regulation_name: regulation.regulation_name,
          regulation_description: regulation.regulation_description,
          regulation_edition_date: regulation.regulation_edition_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_product_id: userProductId,
          user_id: user.id,
        }))
      )
      .select();

    if (userProductUserRegulationsError) throw userProductUserRegulationsError;

    // Save standards to database
    const {
      data: userProductUserStandards,
      error: userProductUserStandardsError,
    } = await supabase
      .from("user_product_user_standards")
      .insert(
        jsonObject.standards.map((standard) => ({
          ref_no: standard.ref_no,
          edition_date: standard.edition_or_date,
          title: standard.title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_product_id: userProductId,
          user_id: user.id,
        }))
      )
      .select();

    if (userProductUserStandardsError) throw userProductUserStandardsError;

    // Return all saved data
    return NextResponse.json({
      directives: userProductUserDirectives,
      regulations: userProductUserRegulations,
      standards: userProductUserStandards,
    });
  } catch (error) {
    console.error("Error processing data: ", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}
