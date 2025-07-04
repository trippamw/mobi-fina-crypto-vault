-- First, update the handle_new_user function to create an MWK wallet as default instead of USD
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name, phone_number)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'phone_number', NEW.phone)
    );
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    -- Create default MWK wallet (Malawian Kwacha as default)
    INSERT INTO public.wallets (user_id, currency_code, wallet_type, is_primary)
    VALUES (NEW.id, 'MWK', 'fiat', TRUE);
    
    RETURN NEW;
END;
$function$;